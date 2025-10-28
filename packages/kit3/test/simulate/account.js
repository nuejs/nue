
import { setup } from '../../src/cli/setup'

const mockApi = {

  async checkAvailability(name) {
    await Bun.sleep(500)
    return name !== 'taken'
  },

  async registerAccount(name, email) {
    await Bun.sleep(500)
    return { verificationId: 'test-id-123' }
  },

  async waitForVerification(verificationId) {
    await Bun.sleep(1000)
    return 'test-token-xyz'
  },

  async saveAccount(accountName, token) {
    await Bun.sleep(500)
    return true
  }
}

await setup(mockApi)