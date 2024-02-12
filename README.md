# axios-transform-validate-response

Plugin to transform and validate axios responses using typestack class-transformer and class-validator.

## Usage

At some point in your application apply the plugin as default response transformer:

```typescript
axios.defaults.transformResponse = classTransformValidateResponse;
```

To apply the transformer use the requests config as follows:

```typescript
await axios.get('https://api.example.com', {
    classTransformConfig: {
        targetClass: TestClass, // <- Class to transform the response to
        dataRetriever: (data: any) => data.data // <- (optional) Function to retrieve the data from the response
    }
});
```

### Typings
To stop your IDE from yelling at you about the `classTransformConfig` property, you can add the following typings to your project:

```typescript
export * from "axios-transform-validate-response";
```