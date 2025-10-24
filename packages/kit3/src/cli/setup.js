
import { createFlow } from './flow.js'

export async function setup(api) {
  const flow = createFlow()

  try {
    const accountName = await flow.ask({
      title: 'Choose your subdomain',
      desc: 'This will be your deployment URL: <subdomain>.nuejs.com',
      question: 'Subdomain',
      validate: validateAccountName,
      validateError: 'invalid characters (use a-z, 0-9, hyphen)',
      check: api.checkAvailability,
      checkError: 'this name is taken',
      success: 'available'
    })

    const email = await flow.ask({
      title: 'Verify ownership',
      desc: 'We\'ll send a verification link to confirm your email',
      question: 'Email',
      validate: validateEmail,
      validateError: 'invalid email address',
      success: 'verification email sent'
    })

    const { verificationId } = await api.registerAccount(accountName, email)

    const token = await flow.wait({
      title: 'Confirm email',
      desc: 'Check your inbox for the verification link',
      poll: () => api.waitForVerification(verificationId),
      pollError: 'verification expired',
      success: 'verified'
    })

    await api.saveAccount(accountName, token)

    flow.waitEnter({
      title: 'Ready to deploy',
      desc: 'Press ENTER to continue...'

    })

  } catch (err) {
    console.error(`✗ ${err.message}`)
    process.exit(1)
  }
}


function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateAccountName(name) {
  if (name.length < 3 || name.length > 30) return false
  if (name.startsWith('-') || name.endsWith('-')) return false
  if (/^\d/.test(name)) return false
  return /^[a-z0-9-]+$/.test(name)
}
