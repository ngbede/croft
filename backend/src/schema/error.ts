export default interface ErrorObject {
    message?: string,
    code: number,
    error?: string | Object | Array<any>
}
