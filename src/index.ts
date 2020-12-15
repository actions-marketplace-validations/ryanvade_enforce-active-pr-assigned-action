import * as core from "@actions/core";
import * as github from "@actions/github";

export interface Assignee {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: "User" | string,
    site_admin: boolean;
}

async function run() {
    try {
        core.debug("Starting Enfore Active PR Assignee Action");
        const draft = getPullRequestDraftStatus();
        const assignees = getPullRequestAssignees();

        core.debug(`Draft: ${draft}`);
        core.debug(`Assignees: ${JSON.stringify(assignees)}`);

        if (!isValidPullRequest(draft, assignees)) {
            core.info("Assignee check for Active status failed");
            core.setFailed("Active Pull Requests must have at least one Assignee");
            return;
        }
        core.info("Assignee check for Pull Request Draft status Passed");

    } catch (error) {
        core.setFailed(error.message);
    }
}

export function getPullRequestDraftStatus(): boolean {
    let pullRequest = github.context.payload.pull_request;
    if (pullRequest === undefined || pullRequest.draft === undefined) {
        throw new Error("This action should only be run with Pull Request Events");
    }
    return pullRequest.draft;
}

export function getPullRequestAssignees(): Array<Assignee> {
    let pullRequest = github.context.payload.pull_request;
    if (pullRequest === undefined || pullRequest.assignees === undefined) {
        throw new Error("This action should only be run with Pull Request Events");
    }
    return pullRequest.assignees;
}

export function isValidPullRequest(draft: boolean, assigness: Array<Assignee>) {
    if (draft) {
        return true;
    }

    return assigness.length > 0;
}

run()