import { App, Stack } from "aws-cdk-lib";

const app = new App();

const name = `Upstart`;
new Stack(app, name, { stackName: name, env: { region: "ca-west-1" } });

app.synth();
