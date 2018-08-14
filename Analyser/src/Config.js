import External from './External';

const process = External.load('process');

function Default(i, d) {
    const envvar = process.env[`EXPOSE_${i}`];
    return envvar || d;
}

export default {
    incrementalSolverEnabled: !!Default('USE_INCREMENTAL_SOLVER', true),
    maxRefinements: Number.parseInt(Default('MAX_REFINEMENTS', '50')),
    maxSolverTime: Number.parseInt(Default('MAX_SOLVER_TIME', 1800000)),
    regexEnabled: !Default('DISABLE_REGULAR_EXPRESSIONS', false),
    capturesEnabled: !Default('DISABLE_CAPTURE_GROUPS', false),
    refinementsEnabled: !Default('DISABLE_REFINEMENTS', false),
    outFilePath: Default('OUT_PATH', undefined),
    outCoveragePath: Default('COVERAGE_PATH', undefined),
    outQueriesDir: Default('QUERY_DUMP', undefined)
}
