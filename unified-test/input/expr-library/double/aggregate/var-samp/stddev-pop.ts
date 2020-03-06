export function varSamp (values : readonly number[]) {
    if (values.length == 0 || values.length == 1) {
        return null;
    }
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
    return sumSquaredErrors / (count-1);
}
