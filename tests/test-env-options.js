import t from 'tap'

// preserve existing env
const e = process.env.DOTENV_CONFIG_ENCODING
const p = process.env.DOTENV_CONFIG_PATH
const d = process.env.DOTENV_CONFIG_DEBUG
const o = process.env.DOTENV_CONFIG_OVERRIDE

// get fresh object for each test
let n = 0
async function options () {
  return (await import(`../lib/env-options.js?${++n}`)).default
}

async function testOption (envVar, tmpVal, expect) {
  delete process.env[envVar]
  process.env[envVar] = tmpVal

  t.same(await options(), expect)

  delete process.env[envVar]
}

// returns empty object when no options set in process.env
delete process.env.DOTENV_CONFIG_ENCODING
delete process.env.DOTENV_CONFIG_PATH
delete process.env.DOTENV_CONFIG_DEBUG
delete process.env.DOTENV_CONFIG_OVERRIDE

t.same(options(), {});

(async () => {
  // sets encoding option
  await testOption('DOTENV_CONFIG_ENCODING', 'latin1', { encoding: 'latin1' })

  // sets path option
  await testOption('DOTENV_CONFIG_PATH', '~/.env.test', { path: '~/.env.test' })

  // sets debug option
  await testOption('DOTENV_CONFIG_DEBUG', 'true', { debug: 'true' })

  // sets override option
  await testOption('DOTENV_CONFIG_OVERRIDE', 'true', { override: 'true' })
})()

// restore existing env
process.env.DOTENV_CONFIG_ENCODING = e
process.env.DOTENV_CONFIG_PATH = p
process.env.DOTENV_CONFIG_DEBUG = d
process.env.DOTENV_CONFIG_OVERRIDE = o
