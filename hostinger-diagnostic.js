#!/usr/bin/env node

// Diagnostic script for Hostinger deployment
// Run this on Hostinger to check if everything is set up correctly

const path = require('path')
const fs = require('fs')

console.log('='.repeat(60))
console.log('HOSTINGER DEPLOYMENT DIAGNOSTIC')
console.log('='.repeat(60))

// 1. Check Node.js version
console.log('\n1. Node.js Version:')
console.log('   Version:', process.version)
const majorVersion = parseInt(process.version.slice(1).split('.')[0])
if (majorVersion < 18) {
  console.log('   ❌ ERROR: Node.js 18+ required. Current:', process.version)
} else {
  console.log('   ✓ Node.js version OK')
}

// 2. Check current directory
console.log('\n2. Current Directory:')
console.log('   CWD:', process.cwd())

// 3. Check required files
console.log('\n3. Required Files:')
const requiredFiles = [
  'package.json',
  'server.js',
  'next.config.js',
  '.env',
  'prisma/schema.prisma'
]

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  const exists = fs.existsSync(filePath)
  console.log(`   ${exists ? '✓' : '❌'} ${file}`)
})

// 4. Check directories
console.log('\n4. Required Directories:')
const requiredDirs = [
  'node_modules',
  '.next',
  'src/app',
  'public'
]

requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir)
  const exists = fs.existsSync(dirPath)
  if (exists) {
    console.log(`   ✓ ${dir}/`)
  } else {
    console.log(`   ❌ ${dir}/ (MISSING)`)
  }
})

// 5. Check environment variables
console.log('\n5. Environment Variables:')
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NODE_ENV'
]

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  if (value) {
    const masked = envVar.includes('SECRET') || envVar.includes('PASSWORD')
      ? '***SET***'
      : value
    console.log(`   ✓ ${envVar}=${masked}`)
  } else {
    console.log(`   ❌ ${envVar} NOT SET`)
  }
})

// 6. Check if Next.js is installed
console.log('\n6. Next.js Installation:')
try {
  const nextPath = path.join(process.cwd(), 'node_modules', 'next', 'package.json')
  if (fs.existsSync(nextPath)) {
    const nextPackage = JSON.parse(fs.readFileSync(nextPath, 'utf8'))
    console.log(`   ✓ Next.js ${nextPackage.version} installed`)
  } else {
    console.log('   ❌ Next.js not found in node_modules')
  }
} catch (err) {
  console.log('   ❌ Error checking Next.js:', err.message)
}

// 7. Check if Prisma Client is generated
console.log('\n7. Prisma Client:')
const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client')
if (fs.existsSync(prismaClientPath)) {
  console.log('   ✓ Prisma Client generated')
} else {
  console.log('   ❌ Prisma Client NOT generated')
  console.log('   Run: npx prisma generate')
}

// 8. Test database connection
console.log('\n8. Database Connection:')
if (process.env.DATABASE_URL) {
  console.log('   ✓ DATABASE_URL is set')
  console.log('   Note: Actual connection test requires Prisma Client')
} else {
  console.log('   ❌ DATABASE_URL not set - cannot test connection')
}

// 9. Summary
console.log('\n' + '='.repeat(60))
console.log('DIAGNOSTIC COMPLETE')
console.log('='.repeat(60))
console.log('\nIf all checks passed (✓), your setup is ready.')
console.log('If there are ❌ marks, fix them before deploying.')
console.log('\nNext steps:')
console.log('1. Ensure .env file exists with all variables')
console.log('2. Run: npm install')
console.log('3. Run: npm run build')
console.log('4. Start server: node server.js')
console.log('\nFor Hostinger logs, check:')
console.log('- /home/u443955779/domains/printmedia.fi/error_log')
console.log('- Hostinger hPanel -> Logs')
