const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  it('Should response 404 when request unregistered route', async () => {
    const server = await createServer({})

    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    })

    expect(response.statusCode).toEqual(404)
  })

  describe('When POST /users', () => {
    it('Should response 201 and persisted user', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedUser).toBeDefined()
    })

    it('Should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
    })

    it('Should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Tidak dapat membuat user baru karena tipe data tidak sesuai')
    })

    it('Should response 400 when username more than 50 character', async () => {
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Tidak dapat membuat user baru karena karakter username melebihi batas limit')
    })

    it('Should response 400 when username contain restricted character', async () => {
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Tidak dapat membuat user baru karena username mengandung karakter terlarang')
    })

    it('Should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' })

      const requestPayload = {
        username: 'dicoding',
        password: 'super_secret',
        fullname: 'Dicoding Indonesia',
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Username tidak tersedia')
    })
  })

  it('Should handle server error correctly', async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'super_secret',
      fullname: 'Dicoding Indonesia',
    }
    const server = await createServer({})

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('Terjadi kegagalan pada server kami')
  })
})
