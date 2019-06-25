import findIndex from '@tinkoff/utils/array/findIndex';
import includes from '@tinkoff/utils/array/includes';

const EXCEPTION_NUMBERS_MIN = 11;
const EXCEPTION_NUMBERS_MAX = 14;
const CASES_GROUPS = [[0, 5, 6, 7, 8, 9], [1], [2, 3, 4]];

export default function getWordCaseByNumber (number, cases) {
    if (number >= EXCEPTION_NUMBERS_MIN && number <= EXCEPTION_NUMBERS_MAX) {
        return cases[0];
    }

    const lastNumber = number % 10;
    const resultIndex = findIndex((group) => includes(lastNumber, group), CASES_GROUPS);

    return cases[resultIndex];
}
