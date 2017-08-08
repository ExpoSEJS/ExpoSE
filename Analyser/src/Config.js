const OUT_PATH = 'EXPOSE_OUT_PATH';
const COVERAGE_PATH = 'EXPOSE_COVERAGE_PATH';
const UNINSTRUMENTED_LINE_COVERAGE = 'UNINSTRUMENTED_LINE_COVERAGE';

function Default(i, d) {
	return process.env[i] || d;
}

export default {
	capturesEnabled: !Default('DISABLE_CAPTURE_GROUPS', false),
	refinementsEnabled: !Default('DISABLE_REFINEMENTS', false),
	outFilePath: Default(OUT_PATH, undefined),
	outCoveragePath: Default(COVERAGE_PATH, undefined),
	returnUninstrumentedLineCoverage: Default(UNINSTRUMENTED_LINE_COVERAGE, false)
}