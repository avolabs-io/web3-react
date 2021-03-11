import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'

interface PrivateKeyConnectorArguments {
  providerUri: string
  privateKey: string
}

export class PrivateKeyConnector extends AbstractConnector {
  private readonly providerUri: string
  private readonly privateKey: string

  public provider: any

  constructor({ providerUri, privateKey }: PrivateKeyConnectorArguments) {
    super({ supportedChainIds: [] })

    this.privateKey = privateKey
    this.providerUri = providerUri
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.provider) {
      const PrivateKeyProvider = await import('truffle-privatekey-provider').then(m => m?.default ?? m)
      this.provider = new PrivateKeyProvider(this.privateKey, this.providerUri)
      console.log(
        `Hello from inside the custom private-key-connector. I am being created with this account ${this.provider.account} on this network, ${this.providerUri}`
      )
      await this.provider.init()
    }
    const account = this.provider.account

    return { provider: this.provider.provider, account }
  }

  public async getProvider(): Promise<any> {
    return this.provider
  }

  public async getChainId(): Promise<number | string> {
    return 1
  }

  public async getAccount(): Promise<null | string> {
    return this.provider.send('eth_accounts').then((accounts: string[]): string => accounts[0])
  }

  public async deactivate() {}

  public async close() {
    // Doesn't do any other cleanup
    this.emitDeactivate()
  }
}
