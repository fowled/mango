import { error } from 'utils/logger';

module.exports = {
    name: 'error',
    execute(err: Error) {
        error(err.message);
    },
};
