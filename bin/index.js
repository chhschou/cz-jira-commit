#!/usr/bin/env node
const yargs = require('yargs')
const { addCmt, onPush } = require('../jira')

if (process.argv.length >= 3) {
    const cmd = process.argv[2]
    switch (cmd) {
        case 'add':
            const argv = yargs
                .string('issue')
                .string('time')
                .argv

            if (argv.issue) return addCmt({ issue: argv.issue, time: argv.time })
            break;
        case 'push':
            return onPush()
        default:
            console.error(`Unknown command: ${cmd}`)
    }
}