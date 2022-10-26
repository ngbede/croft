import axios from 'axios'

export default class RestAdapter {
	baseUrl: string
	token: string
	header: object

	constructor(baseUrl: string, token: string, header?: object) {
		this.baseUrl = baseUrl
		this.token = token
		this.header = header || { 'Authorization': this.token }
	}

	async create(resource: string, payload: object) {
		const data = await axios.post(`${this.baseUrl}${resource}`, payload, {
			headers: this.header
		})
		return data
	}

	async read(resource: string, params?: object) {
		const data = await axios.get(`${this.baseUrl}${resource}`, {
			params: params,
			headers: this.header
		})
		return data
	}

	async update(resource: string, params?: object) {
		const data = await axios.patch(`${this.baseUrl}${resource}`, {
			params: params,
			headers: this.header
		})
		return data
	}

	async delete(resource: string, params?: object) {
		const data = await axios.delete(`${this.baseUrl}${resource}`, {
			params: params,
			headers: this.header
		})
		return data
	}
}
