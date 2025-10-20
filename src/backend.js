import ky from 'ky';
import { createAuth0Client } from '@auth0/auth0-spa-js';

import { backendEndpoint, auth0Config } from './config.js';

let auth0ClientPromise;

export function backendUrl(path) {
  return new URL(path, backendEndpoint);
}

export const contentTypeJson = { 'Content-Type': 'application/json' };

async function getAuthClient() {
  if (!auth0ClientPromise) {
    auth0ClientPromise = createAuth0Client(auth0Config);
  }
  return auth0ClientPromise;
}

async function buildCommonHeaders(extraHeaders = {}) {
  const auth0 = await getAuthClient();
  const token = await auth0.getTokenSilently();
  return {
    ...contentTypeJson,
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };
}

function normalizeTarget(target) {
  if (target instanceof URL) {
    return target;
  }
  if (typeof target === 'string') {
    if (/^https?:\/\//i.test(target)) {
      return new URL(target);
    }
    return backendUrl(target);
  }
  throw new TypeError('Expected target to be a URL or string');
}

async function authorizedRequest(target, options = {}) {
  const { headers: extraHeaders = {}, ...rest } = options;
  const headers = await buildCommonHeaders(extraHeaders);
  const url = normalizeTarget(target);
  return ky(String(url), {
    ...rest,
    headers,
  });
}

async function runOrUndefined(fn) {
  try {
    return await fn();
  } catch (e) {
    console.error('Backend request failed', e);
    return undefined;
  }
}

export const loadGroup = async () =>
  runOrUndefined(async () => {
    const response = await authorizedRequest('/api/groups/me');
    const groups = await response.json();
    return groups[0];
  });

export const loadUser = async (id) =>
  runOrUndefined(async () => {
    const response = await authorizedRequest(`/api/users/${id}`);
    return response.json();
  });

export const loadUsers = async () =>
  runOrUndefined(async () => {
    const group = await loadGroup();
    const memberIds = Array.isArray(group?.members) ? group.members : [];

    if (memberIds.length === 0) {
      return [];
    }

    const users = await Promise.all(memberIds.map((memberId) => loadUser(memberId)));
    return users.filter(Boolean);
  });

export async function loadHistory(uri) {
  if (!uri) {
    return [];
  }
  const result = await runOrUndefined(async () => {
    const response = await authorizedRequest(uri);
    return response.json();
  });
  return Array.isArray(result) ? result : [];
}

export async function createHistoryEntry(payload) {
  await authorizedRequest('/api/trips', {
    method: 'POST',
    json: payload,
  });
}
