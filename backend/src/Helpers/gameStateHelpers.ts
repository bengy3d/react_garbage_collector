export function hasCircularReference(obj: any) {
    const seenObjects = new Set(); // Initialize the Set to keep track of seen objects

    try {
        // Attempt to stringify with a replacer function that detects cycles
        JSON.stringify(obj, (key, value) => {
            // If the value is an object, check if we've seen it before
            if (typeof value === 'object' && value !== null) {
                if (seenObjects.has(value)) {
                    console.log('Circular reference detected');
                    console.log(key);
                    console.log(value);
                    throw new Error('Circular reference detected');
                }
                seenObjects.add(value);
            }
            return value;
        });
        // No circular reference if we reach here
        return false;
    } catch (error) {
        // Circular reference detected if an error was thrown
        return true;
    }
}
