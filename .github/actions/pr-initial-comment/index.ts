const core = require('@actions/core');
const github = require('@actions/github');

(async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const pullRequestNumber = github.context.payload.pull_request.number;
    const request = {
      owner: github.context.repo.owner,
      pull_number: github.context.payload.pull_request.number,
      repo: github.context.repo.repo
    };

    const client = new github.GitHub(token);
    const sampleUrl =
      `<a href="pull/${pullRequestNumber}">pull/${pullRequestNumber}</a>`;

    const res = await client.pulls.get(request);
    core.warn('***Response', res);
    core.warn('***Response.body', res.body);
    const existingBody = res.body;
    request['body'] = `${existingBody}

Jira: ${'abcd'}
Sample: ${sampleUrl}`;

    core.warn('***Target.body', request['body']);

    const response = await client.pulls.update(request);

    if (response.status !== 200) {
      core.error('Updating the pull request has failed');
    }
  } catch(error) {
    core.error(error);
    core.setFailed(error.message);
  }
})();
