const { exec } = require('node:child_process') // usado para inicializar processos filhos dentro do script

function checkPostgres() {
  // comando, callback
  exec('docker exec clone_tabnews_db pg_isready --host localhost', handleReturn)

  // stdout = standard output
  function handleReturn (error, stdout) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write('.')
      checkPostgres()
      return
    }

    console.log('\n🟢 Postgres está pronto e aceitando conexões!\n')
  }
}

process.stdout.write('\n\n🔴 Aguardando Postgres aceitar conexões')
checkPostgres()