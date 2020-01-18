# shopping-list-aws
 Shopping list with AWS S3, API Gateway and DynamoDB
 ## For offline use (only works with initial list, the shopping list) needs a downloaded Fontawesome and Jquery
 ## Code is written mostly in Spanish
 ## Requires:
 - API in API Gateway with following resources: additem (POST), addtolist (POST), deleteitem (DELETE), getall (GET), getitem (GET), getlist (GET), removefromlist (POST), setcheck (POST), updateitem (POST).
 - API methods connect with DynamoDB
 - A table in DynamoDB with the following columns: id, category, name, quantity, isInShoppingList.
