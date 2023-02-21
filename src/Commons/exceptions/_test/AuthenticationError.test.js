const AuthenticationError = require('../AuthenticationError')

describe('AuthenticationsError', () => {
  it('Should create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('Authentication error!')

    expect(authenticationError.statusCode).toEqual(401)
    expect(authenticationError.message).toEqual('Authentication error!')
    expect(authenticationError.name).toEqual('AuthenticationError')
  })
})
