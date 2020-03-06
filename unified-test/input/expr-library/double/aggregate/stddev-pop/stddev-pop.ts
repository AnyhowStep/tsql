export function stdDevPop (values : readonly number[]) {
    const sum = values.reduce(
        (sum, value) => sum + value,
        0
    );
    const count = values.length;
    const avg = sum/count;
    const squaredErrors = values.map(value => {
        return Math.pow(value - avg, 2);
    });
    const sumSquaredErrors = squaredErrors.reduce(
        (sumSquaredErrors, squaredError) => sumSquaredErrors + squaredError,
        0
    );
    return Math.sqrt(
        sumSquaredErrors / count
    );
}
