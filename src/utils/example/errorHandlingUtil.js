function handleError(operation, onError, retryLimit = 3) {
    let attempts = 0;

    function attemptOperation() {
        try {
            operation()
                .then(() => console.log("Operation successful"))
                .catch((error) => {
                    if (attempts < retryLimit) {
                        console.log("Attempting retry", attempts + 1);
                        attempts++;
                        setTimeout(attemptOperation, 1000); // Wait 1 second before retrying
                    } else {
                        onError(error); // Handle the error after exceeding retry limit
                    }
                });
        } catch (error) {
            onError(error); // Handle synchronous errors
        }
    }

    attemptOperation();
}

export { handleError };
