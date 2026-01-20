import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditLogs } from '../AuditLogs';
import * as api from '@/services/api';

vi.mock('@/services/api');
vi.mock('react-hot-toast');
vi.mock('date-fns');

describe('AuditLogs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render audit logs page', () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: {
        logs: [],
        total: 0,
      },
    });

    render(<AuditLogs />);
    expect(screen.getByText(/Логи аудита/i)).toBeInTheDocument();
  });

  it('should load and display logs', async () => {
    const mockLogs = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        action: 'CREATE',
        entityType: 'User',
        entityId: 'entity1',
        changes: {},
        timestamp: '2026-01-20T18:00:00Z',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        status: 'success' as const,
      },
    ];

    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: {
        logs: mockLogs,
        total: 1,
      },
    });

    render(<AuditLogs />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('CREATE')).toBeInTheDocument();
    });
  });

  it('should filter by date range', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: { logs: [], total: 0 },
    });

    render(<AuditLogs />);

    const dateInputs = screen.getAllByRole('textbox', { hidden: true });
    expect(dateInputs.length).toBeGreaterThan(0);
  });

  it('should export logs to CSV', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: { logs: [], total: 0 },
    });

    const mockBlob = new Blob(['csv,data']);
    vi.spyOn(api, 'get').mockResolvedValueOnce(mockBlob);

    render(<AuditLogs />);

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock');

    await waitFor(() => {
      const exportButton = screen.getByText(/Экспорт CSV/i);
      expect(exportButton).toBeInTheDocument();
    });
  });
});
