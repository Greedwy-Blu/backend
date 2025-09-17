#!/bin/bash

# Scripts úteis para gerenciamento da aplicação

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# ================================
# FUNÇÕES DE DESENVOLVIMENTO
# ================================

# Iniciar ambiente de desenvolvimento
dev_start() {
    log "🚀 Iniciando ambiente de desenvolvimento..."
    
    # Verificar se .env existe
    if [ ! -f ".env" ]; then
        warn "Arquivo .env não encontrado. Copiando de .env.example..."
        cp .env.example .env
        warn "⚠️  Configure o arquivo .env antes de continuar!"
        return 1
    fi
    
    # Iniciar apenas o banco de dados
    docker-compose up -d db 
    
    # Aguardar banco estar pronto
    log "⏳ Aguardando banco de dados ficar pronto..."
    sleep 10
    
    # Verificar se banco está acessível
    if docker-compose exec db pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-postgres}; then
        log "✅ Banco de dados está pronto!"
        log "🔗 Banco disponível em: localhost:5432"
        log "🔗 Adminer disponível em: http://localhost:8080"
        
        # Iniciar aplicação em modo desenvolvimento
        log "🔧 Inicie a aplicação com: npm run start:dev"
    else
        error "❌ Banco de dados não está respondendo"
        return 1
    fi
}

# Parar ambiente de desenvolvimento
dev_stop() {
    log "🛑 Parando ambiente de desenvolvimento..."
    docker-compose down
    log "✅ Ambiente parado!"
}

# ================================
# FUNÇÕES DE PRODUÇÃO
# ================================

# Deploy completo
prod_deploy() {
    log "🚀 Fazendo deploy da aplicação..."
    
    # Build e start
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    
    # Aguardar serviços ficarem prontos
    log "⏳ Aguardando serviços ficarem prontos..."
    sleep 30
    
    # Verificar health
    prod_health
}

# Verificar saúde da aplicação
prod_health() {
    log "🏥 Verificando saúde da aplicação..."
    
    # Verificar se containers estão rodando
    if docker-compose ps | grep -q "Up"; then
        log "✅ Containers estão rodando"
        
        # Verificar endpoint de health
        if curl -f http://localhost:3000/health >/dev/null 2>&1; then
            log "✅ Aplicação está saudável!"
            log "🔗 API disponível em: http://localhost:3000"
            log "🔗 Adminer disponível em: http://localhost:8080"
            log "🔗 Health check: http://localhost:3000/health"
        else
            error "❌ Aplicação não está respondendo no health check"
            return 1
        fi
    else
        error "❌ Containers não estão rodando"
        return 1
    fi
}

# ================================
# FUNÇÕES DE BANCO DE DADOS
# ================================

# Backup do banco
db_backup() {
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    log "💾 Criando backup do banco: $backup_file"
    
    docker-compose exec db pg_dump -U ${POSTGRES_USER:-postgres} ${POSTGRES_DB:-postgres} > $backup_file
    
    if [ $? -eq 0 ]; then
        log "✅ Backup criado: $backup_file"
    else
        error "❌ Erro ao criar backup"
        return 1
    fi
}

# Restaurar backup
db_restore() {
    if [ -z "$1" ]; then
        error "❌ Especifique o arquivo de backup"
        error "Uso: $0 db_restore backup_file.sql"
        return 1
    fi
    
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        error "❌ Arquivo de backup não encontrado: $backup_file"
        return 1
    fi
    
    warn "⚠️  Isso irá sobrescrever todos os dados do banco!"
    read -p "Continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "🔄 Restaurando backup: $backup_file"
        docker-compose exec -T db psql -U ${POSTGRES_USER:-postgres} ${POSTGRES_DB:-postgres} < $backup_file
        
        if [ $? -eq 0 ]; then
            log "✅ Backup restaurado com sucesso!"
        else
            error "❌ Erro ao restaurar backup"
            return 1
        fi
    else
        log "❌ Operação cancelada"
    fi
}

# Conectar ao banco via psql
db_connect() {
    log "🔗 Conectando ao banco de dados..."
    docker-compose exec db psql -U ${POSTGRES_USER:-postgres} ${POSTGRES_DB:-postgres}
}

# ================================
# FUNÇÕES DE LOGS
# ================================

# Ver logs da aplicação
logs() {
    local service="${1:-backend}"
    log "📋 Mostrando logs do serviço: $service"
    docker-compose logs -f $service
}

# Ver logs de todos os serviços
logs_all() {
    log "📋 Mostrando logs de todos os serviços..."
    docker-compose logs -f
}

# ================================
# FUNÇÃO PRINCIPAL
# ================================

case "$1" in
    "dev:start")
        dev_start
        ;;
    "dev:stop")
        dev_stop
        ;;
    "prod:deploy")
        prod_deploy
        ;;
    "prod:health")
        prod_health
        ;;
    "db:backup")
        db_backup
        ;;
    "db:restore")
        db_restore "$2"
        ;;
    "db:connect")
        db_connect
        ;;
    "logs")
        logs "$2"
        ;;
    "logs:all")
        logs_all
        ;;
    *)
        echo "🛠️  Scripts de gerenciamento da aplicação"
        echo ""
        echo "Desenvolvimento:"
        echo "  $0 dev:start     - Iniciar ambiente de desenvolvimento"
        echo "  $0 dev:stop      - Parar ambiente de desenvolvimento"
        echo ""
        echo "Produção:"
        echo "  $0 prod:deploy   - Deploy completo da aplicação"
        echo "  $0 prod:health   - Verificar saúde da aplicação"
        echo ""
        echo "Banco de dados:"
        echo "  $0 db:backup     - Criar backup do banco"
        echo "  $0 db:restore    - Restaurar backup do banco"
        echo "  $0 db:connect    - Conectar ao banco via psql"
        echo ""
        echo "Logs:"
        echo "  $0 logs [serviço] - Ver logs (padrão: backend)"
        echo "  $0 logs:all      - Ver logs de todos os serviços"
        echo ""
        ;;
esac

