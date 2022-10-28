import axios, { AxiosError } from 'axios'

export default class RestAdapter {
	baseUrl: string
	token: string
	header: object

	constructor(baseUrl: string, token: string, header?: object) {
		this.baseUrl = baseUrl
		this.token = token
		this.header = header || { 'Authorization': this.token }
	}

	// throw cleaner response from integrating rest api
	private _errorHandle(error: unknown) {
		if (error instanceof AxiosError) {
			const err = { ...error.response?.data, code: error.response?.status }
			throw err
		}
	}

	async create(resource: string, payload: object) {
		try {
			return await axios.post(`${this.baseUrl}${resource}`, payload, {
				headers: this.header
			})
		} catch (error) {
			this._errorHandle(error)
			console.log('house of dragons')
			throw error
		}
	}

	async read(resource: string, params?: object) {
		try {
			return await axios.get(`${this.baseUrl}${resource}`, {
				params: params,
				headers: this.header
			})
		} catch (error) {
			this._errorHandle(error)
			throw error
		}
	}

	async update(resource: string, params?: object) {
		try {
			return await axios.patch(`${this.baseUrl}${resource}`, {
				params: params,
				headers: this.header
			})
		} catch (error) {
			this._errorHandle(error)
			throw error
		}

	}

	async delete(resource: string, params?: object) {
		try {
			return await axios.delete(`${this.baseUrl}${resource}`, {
				params: params,
				headers: this.header
			})
		} catch (error) {
			this._errorHandle(error)
			throw error
		}
	}

	async put(resource: string, params?: object) {
		try {
			return await axios.put(`${this.baseUrl}${resource}`, {
				params: params,
				headers: this.header
			})
		} catch (error) {
			this._errorHandle(error)
			throw error
		}
	}
}
