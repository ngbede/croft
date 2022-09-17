# Croft API Documentation
**Version:** 1.0 <br>
The Croft API exist to enable integration to the underlying features provided by the Croft application. This doc serves as a primary reference guide on how to interact with the application both for internal and external usage. <br>
This documentation is intended to aid technical audiences get started with using the API. <br> <br>
**Schemes:** https <br>

## Summary
- Resource: represent individual endpoints specific to the api.
### Resource: `user` <br>
The `/user` endpoint allows for the registration of users unto the app and subsequent management of users sessions via JWT access tokens. <br> <br>
Endpoint   | Description   | Requirement |
|--------- |---------------|-------------| 
|GET `/user/{id}`	       | Get a single JSON object of a users info via its ID.  | **Authentication** access token, requires admin role.|
|POST `/user/signup`       | Create a new user account.    | A JSON body containing the users basic info. **email** & **password** required.|
|POST `/user/reset-password` | Sends a password reset link to the specified email. | A JSON body with the target **email** address to reset. |
|PUT `/user/signin` | Login with with account credentials. | A JSON body with **email** and **password**. |

### Resource: `farm` <br>
The `/farm` endpoint allows for the registration of farm locations unto the platform. Subsequent reads and writes to the farm's information can be done via the endpoint. <br> <br>
Endpoint   | Description   | Requirement |
|--------- |---------------|-------------| 
|GET `/farm/{id}`	       | Get a single JSON object of a registered farm. | **Authentication** access token.|
|POST `/farm/register`       | Create a new farm that is tied to a `user` account. | A JSON body containing the farm's registration info. |
|PATCH `/farm/{id}` | Update an already registered farm's data. | **Authentication** access token & JSON body with data fields to update. |
|DELETE `/farm/{id}` | Delete a registered farms info. | **Authentication** access token. |

### Resource: `setting` <br>
The `/setting` resource is used to manage prices of farm livestock and eggs. One settings doc entity exist per each farm. <br> <br>
Endpoint   | Description   | Requirement |
|--------- |---------------|-------------| 
|GET `/setting/{:id}`	   | Get a single JSON object for a setting. | **Authentication** access token, requires admin role. |
|POST `/setting/create`   | Create a new setting for a farm.  | A JSON body containing the farm's price configuration. |
|PATCH `/setting/{:id}` | Update the settings config for a given farm. | **Authentication** access token, requires admin role & JSON body containing updated setting data. |

### Resource: `batch`
The `/batch` resource allows for farmers to segment their livestock into groups. This is generally based on the time a certain group of chicks were purchased. This allows for tracking of chicken stock and eggs produced by given batch. <br> <br>
Endpoint   | Description   | Requirement |
|--------- |---------------|-------------| 
|GET `/batch`	   | Fetch a list of batches tied to a given farm. | **Authentication** access token. |
|GET `/batch/{id}`   | Fetch a single batch JSON object.  | **Authentication** access token. |
|POST `/batch/create` | Create a new batch of chickens for a given farm. | **Authentication** access token, requires admin role & JSON body of the batch data. |
|PATCH `/batch/{id}` | Update a farm's batch data | **Authentication** access token, requires admin role & JSON body of the updated batch data. |
|DELETE `/batch/{id}` | Delete a given batch for a farm. | **Authentication** access token, requires admin role. |

### Resource: `stock`
The `/stock` resource provides access to the counting feature which allows users tied to a given farm to upload daily stock data of a farms chicken stock alongside recording quantity of eggs picked at an given point in the day. <br> <br>

Endpoint   | Description   | Requirement |
|--------- |---------------|-------------| 
|GET `/stock/{id}`	   | Fetch a single stock JSON object. | **Authentication** access token. |
|POST `/stock/create`   | Upload stock count data for a given batch. | **Authentication** access token & JSON object containing the stock data. |
|PATCH `/stock/{id}` | Update a given stock count data. | **Authentication** access token, & JSON body of updated stock count data. |
|DELETE `/stock/{id}` | Delete a given stock count for a farm. | **Authentication** access token, requires admin role. |
