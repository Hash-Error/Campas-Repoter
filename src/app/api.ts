import { Issue, Analytics } from './data/mockData';

const API_BASE_URL = '/api';

export const fetchIssues = async (): Promise<Issue[]> => {
  const response = await fetch(`${API_BASE_URL}/issues`);
  if (!response.ok) throw new Error('Service Unavailable');
  return response.json();
};

export const fetchIssueById = async (id: string): Promise<Issue> => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`);
    if (!response.ok) throw new Error('Service Unavailable');
  return response.json();
};

export const createIssue = async (issue: Omit<Issue, 'id' | 'reportedAt' | 'status'>): Promise<Issue> => {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issue),
  });
    if (!response.ok) throw new Error('Service Unavailable');
  return response.json();
};

export const updateIssueStatus = async (id: string, status: string): Promise<Issue> => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
    if (!response.ok) throw new Error('Service Unavailable');
  return response.json();
};

export const fetchAnalytics = async (): Promise<Analytics> => {
  const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) throw new Error('Service Unavailable');
  return response.json();
};

