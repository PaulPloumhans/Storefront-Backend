import {
    DisplayProcessor,
    SpecReporter,
    StacktraceOption
} from 'jasmine-spec-reporter';
//import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: jasmine.JasmineStartedInfo, log: string): string {
        return `${log}`;
    }
    //displaySuite(suite: CustomReporterResult, log: string): string;
    public displaySuite(suite: jasmine.SuiteResult, log: string){
        return `${log}`;
    }
    public displaySpecStarted(spec: jasmine.SpecResult, log: string){
        return `${log}`;
    }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displayStacktrace: StacktraceOption.PRETTY,
            displayPending: true
        },
        customProcessors: [CustomProcessor]
    })
);
