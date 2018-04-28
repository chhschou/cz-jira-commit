const { execSync } = require('child_process');
const { basename } = require('path');

module.exports = {
    getRepositoryName: function () {
        const repoName = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
        return basename(repoName);
    },
    getBranchName: function () {
        return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    }
} 