import * as github from "@actions/github";
import { readFileSync } from "fs";
import { getPullRequestDraftStatus, getPullRequestAssignees, isValidPullRequest } from "../src/index";

describe("index", () => {
    describe("getPullRequestDraftStatus", () => {
        it("returns true if a pull request is in draft", () => {
            process.env["GITHUB_EVENT_PATH"] = __dirname + "/draft-context.json";
            github.context.payload = JSON.parse(
                readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' })
            );
            const draft = getPullRequestDraftStatus();
            expect(draft).toBe(true);
        });

        it("returns false if a pull request is not a draft", () => {
            process.env["GITHUB_EVENT_PATH"] = __dirname + "/active-context.json";
            github.context.payload = JSON.parse(
                readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' })
            );
            const draft = getPullRequestDraftStatus();
            expect(draft).toBe(false);
        });

        it("throws an error if the context is not for a pull request", () => {
            process.env["GITHUB_EVENT_PATH"] = __dirname + "/wrong-event-type-context.json";
            github.context.payload = JSON.parse(
                readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' })
            );
            expect(getPullRequestDraftStatus).toThrowError("This action should only be run with Pull Request Events");
        });
    });

    describe("getPullRequestAssigness", () => {
        it("returns a pull requests assignees", () => {
            process.env["GITHUB_EVENT_PATH"] = __dirname + "/assigned-context.json";
            github.context.payload = JSON.parse(
                readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' })
            );
            const actualAssigness = [
                {
                    "login": "DangerNoodle98",
                    "id": 58862849,
                    "node_id": "MDQ6VXNlcjU4ODYyODQ5",
                    "avatar_url": "https://avatars2.githubusercontent.com/u/58862849?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/DangerNoodle98",
                    "html_url": "https://github.com/DangerNoodle98",
                    "followers_url": "https://api.github.com/users/DangerNoodle98/followers",
                    "following_url": "https://api.github.com/users/DangerNoodle98/following{/other_user}",
                    "gists_url": "https://api.github.com/users/DangerNoodle98/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/DangerNoodle98/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/DangerNoodle98/subscriptions",
                    "organizations_url": "https://api.github.com/users/DangerNoodle98/orgs",
                    "repos_url": "https://api.github.com/users/DangerNoodle98/repos",
                    "events_url": "https://api.github.com/users/DangerNoodle98/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/DangerNoodle98/received_events",
                    "type": "User",
                    "site_admin": false
                }
            ];
            const assignees = getPullRequestAssignees();
            expect(assignees).toEqual(actualAssigness);
        });

        it("throws an error if the context is not for a pull request", () => {
            process.env["GITHUB_EVENT_PATH"] = __dirname + "/wrong-event-type-context.json";
            github.context.payload = JSON.parse(
                readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' })
            );
            expect(getPullRequestAssignees).toThrowError("This action should only be run with Pull Request Events");
        });
    });

    describe("isValidPullRequest", () => {
        it("returns true if the pull request is a draft", () => {
            const draftAndNoAssigness = isValidPullRequest(true, []);
            expect(draftAndNoAssigness).toBe(true);

            const draftAndAssigness = isValidPullRequest(true, [{
                "login": "DangerNoodle98",
                "id": 58862849,
                "node_id": "MDQ6VXNlcjU4ODYyODQ5",
                "avatar_url": "https://avatars2.githubusercontent.com/u/58862849?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/DangerNoodle98",
                "html_url": "https://github.com/DangerNoodle98",
                "followers_url": "https://api.github.com/users/DangerNoodle98/followers",
                "following_url": "https://api.github.com/users/DangerNoodle98/following{/other_user}",
                "gists_url": "https://api.github.com/users/DangerNoodle98/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/DangerNoodle98/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/DangerNoodle98/subscriptions",
                "organizations_url": "https://api.github.com/users/DangerNoodle98/orgs",
                "repos_url": "https://api.github.com/users/DangerNoodle98/repos",
                "events_url": "https://api.github.com/users/DangerNoodle98/events{/privacy}",
                "received_events_url": "https://api.github.com/users/DangerNoodle98/received_events",
                "type": "User",
                "site_admin": false
            }]);

            expect(draftAndAssigness).toBe(true);
        });

        it("returns true if the pull request is not a draft and has assignees", () => {
            const draft = false;
            const assignees = [{
                "login": "DangerNoodle98",
                "id": 58862849,
                "node_id": "MDQ6VXNlcjU4ODYyODQ5",
                "avatar_url": "https://avatars2.githubusercontent.com/u/58862849?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/DangerNoodle98",
                "html_url": "https://github.com/DangerNoodle98",
                "followers_url": "https://api.github.com/users/DangerNoodle98/followers",
                "following_url": "https://api.github.com/users/DangerNoodle98/following{/other_user}",
                "gists_url": "https://api.github.com/users/DangerNoodle98/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/DangerNoodle98/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/DangerNoodle98/subscriptions",
                "organizations_url": "https://api.github.com/users/DangerNoodle98/orgs",
                "repos_url": "https://api.github.com/users/DangerNoodle98/repos",
                "events_url": "https://api.github.com/users/DangerNoodle98/events{/privacy}",
                "received_events_url": "https://api.github.com/users/DangerNoodle98/received_events",
                "type": "User",
                "site_admin": false
            }];
            expect(isValidPullRequest(draft, assignees)).toBe(true);
        });

        it("returns false if the pull request is not a draft and is not assigned", () => {
            const draft = false;
            const assignees:any[] = [];

            expect(isValidPullRequest(draft, assignees)).toBe(false);
        });
    });
});