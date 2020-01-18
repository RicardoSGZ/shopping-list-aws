# shopping-list-aws
 Shopping list with AWS S3, API Gateway and DynamoDB
 - For offline use (only works with initial list, the shopping list) needs a downloaded Fontawesome and Jquery
 - Code is written mostly in Spanish
 ## Requires:
 ### A table in DynamoDB with the following columns: id, category, name, quantity, isInShoppingList.
 ### API resources and methods connected with DynamoDB:
 #### additem (POST)
 - Action: PutItem
 - Mapping template:
 ```
 {
  "TableName":"products",
  "Item": {
    "id": {
      "N": "$input.path('$.id')"
    },
    "nombre": {
      "S": "$input.path('$.name')"
    },
    "categoria": {
      "S": "$input.path('$.category')"
    }
  }
}
 ```
 #### addtolist (POST)
 - Action: UpdateItem
 - Mapping template:
 ```
 {
  "TableName":"products",
  "Key": {
    "id": {
      "N": "$input.path('$.id')"
    }
  },
  "ExpressionAttributeNames": {
    "#L": "inShoppingList",
    "#QT": "quantity"
  },
  "ExpressionAttributeValues": {
    ":l": {
      "N": "1"
    },
    ":qt": {
      "N": "$input.path('$.quantity')"
    }
    
  },
  "UpdateExpression": "set #L = :l, #QT = :qt"
}
 ```
#### deleteitem
- Action: DeleteItem
 - Mapping template:
 ```
 {
  "TableName": "products",
  "Key": {
    "id": {
      "N": "$input.path('$.id')"
    }
  }
}
 ```
