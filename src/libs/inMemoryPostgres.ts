import { IBackup, IMemoryDb, newDb } from "pg-mem";

class InMemoryPostgresql {
  private static instance: IMemoryDb
  private backup: IBackup

  async init() {
    try {
      InMemoryPostgresql.instance = newDb();
      await this.runMigrations()
    } catch (e) {
      console.log('Error connecting to InMemoryPostgresql: ', e)
      throw e
    }
  }

  static getInstance() {
    if (!InMemoryPostgresql.instance) {
      console.error('InMemoryPostgresql instance not instantiated.')
    }

    return InMemoryPostgresql.instance
  }

  async runMigrations() {
    const { readdir, readFile } = await require('node:fs/promises')
    const { resolve } = await require('node:path')
    const migrationDirPath = resolve(__dirname, '..', '..', 'prisma', 'migrations')

    const migrationsDir = await readdir(migrationDirPath)
    for (const dir of migrationsDir) {
      if(dir == 'migration_lock.toml') continue

      const migration = await readFile(resolve(migrationDirPath, dir, 'migration.sql'), 'utf-8')
      InMemoryPostgresql.instance.public.none(migration)
    }

    this.backup = InMemoryPostgresql.instance.backup()
  }

  async rollback() {
    this.backup.restore()
  }
}

export default InMemoryPostgresql
