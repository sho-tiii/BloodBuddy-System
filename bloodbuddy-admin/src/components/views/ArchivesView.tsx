import React, { useState } from 'react';
import {
  Archive,
  Search,
  RotateCcw,
  Eye,
  AlertCircle,
  User,
  Droplet,
  Shield,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget, ArchivedItem, ArchiveCategory } from '../../types';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/ToastContext';

interface ArchivesViewProps {
  onNavigate: (target: NavigationTarget) => void;
}

export const ArchivesView: React.FC<ArchivesViewProps> = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [, setTick] = useState(0);

  const archivedItems = dataService.getArchivedItems();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ArchiveCategory>('all');

  // Preview / Restore Modals
  const [inspectingItem, setInspectingItem] = useState<ArchivedItem | null>(null);
  const [restoringItem, setRestoringItem] = useState<ArchivedItem | null>(null);

  const filteredItems = archivedItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const title = item.originalTitle || item.recordId;
      const id = item.originalId || item.recordId;
      const adminName = item.archivedByName || item.archivedByAdminId;
      const reason = item.reason || '';

      const match =
        title.toLowerCase().includes(q) ||
        id.toLowerCase().includes(q) ||
        adminName.toLowerCase().includes(q) ||
        reason.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    return true;
  });

  const handleRestore = () => {
    if (!restoringItem) return;

    const ok = dataService.restoreArchivedItem(restoringItem.id);
    if (ok) {
      addToast(
        'Record Restored',
        `${restoringItem.originalTitle || restoringItem.recordId} has been removed from archives and restored to active views.`,
        'success',
      );
      setRestoringItem(null);
      setTick((t) => t + 1);
    } else {
      addToast('Restore Failed', 'Unable to restore record.', 'danger');
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getCategoryBadge = (cat: ArchiveCategory) => {
    switch (cat) {
      case 'requests':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[12px] font-semibold text-[#A92F35] bg-[#F7EAE7] border border-[#A92F35]/25">
            <Droplet className="w-3 h-3" />
            Request
          </span>
        );
      case 'reports':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[12px] font-semibold text-[#9A6014] bg-[#FCF5E8] border border-[#9A6014]/25">
            <AlertCircle className="w-3 h-3" />
            Report
          </span>
        );
      case 'administrators':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[12px] font-semibold text-[#557A61] bg-[#EDF4EE] border border-[#557A61]/25">
            <Shield className="w-3 h-3" />
            Administrator
          </span>
        );
      case 'user_data':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[12px] font-semibold text-[#746C68] bg-[#F0ECE7] border border-[#E6DDD7]">
            <User className="w-3 h-3" />
            User Record
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
          GOVERNANCE &bull; SUPER ADMIN
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
          System Archives
        </h1>
        <p className="text-[14.5px] text-[#746C68] mt-0.5">
          Soft-deleted, concluded, and archived platform records preserved for compliance and audit integrity.
        </p>
      </div>

      {/* Info Callout */}
      <div className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-[16px] p-4 text-[13.5px] text-[#746C68] flex items-start gap-3">
        <Archive className="w-5 h-5 text-[#A92F35] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          In accordance with BloodBuddy safety protocols, records are never hard-deleted from database storage.
          Archived records are hidden from standard operational listings but remain verifiable and can be restored
          by a Super Administrator at any time.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-4 shadow-[0_2px_8px_rgba(41,37,37,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#958B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="archive-search-input"
            placeholder="Search by title, record ID, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-[13px] text-[#746C68]">
          <span>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-md px-2.5 py-1.5 text-[13px] text-[#292525] focus:outline-none"
          >
            <option value="all">All categories</option>
            <option value="requests">Blood Requests</option>
            <option value="reports">Reports</option>
            <option value="administrators">Administrators</option>
            <option value="user_data">User Data</option>
          </select>
        </div>
      </div>

      {/* Archives Table */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] shadow-[0_2px_8px_rgba(41,37,37,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="archives-table">
            <thead>
              <tr className="border-b border-[#E6DDD7] bg-[#FAF7F2] text-[12px] font-semibold text-[#746C68] uppercase tracking-wider">
                <th className="py-3 px-5">Archived Record</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Archived By</th>
                <th className="py-3 px-4">Archive Date</th>
                <th className="py-3 px-5">Reason</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DDD7] text-[13.5px]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#746C68]">
                    No archived records currently match your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const title = item.originalTitle || item.recordId;
                  const originalId = item.originalId || item.recordId;
                  const adminName = item.archivedByName || item.archivedByAdminId;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-[#292525]">{title}</div>
                        <div className="text-[12px] font-mono text-[#958B86] mt-0.5">
                          ID: {originalId} &bull; Archive ID: {item.id}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">{getCategoryBadge(item.category)}</td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-[#292525]">{adminName}</div>
                        <div className="text-[12px] font-mono text-[#958B86]">{item.archivedByAdminId}</div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-[13px] text-[#746C68]">
                        {formatDate(item.archivedAt)}
                      </td>

                      <td className="py-4 px-5 text-[13px] text-[#746C68] max-w-xs">
                        {item.reason || 'Concluded and archived.'}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setInspectingItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12.5px] font-medium text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2] rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRestoringItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12.5px] font-medium text-[#557A61] hover:bg-[#EDF4EE] rounded-md transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT ARCHIVE MODAL */}
      <Modal
        isOpen={!!inspectingItem}
        onClose={() => setInspectingItem(null)}
        title="Inspect Archived Record"
        id="inspect-archive-modal"
      >
        {inspectingItem && (
          <div className="space-y-4">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E6DDD7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#292525]">
                  {inspectingItem.originalTitle || inspectingItem.recordId}
                </span>
                {getCategoryBadge(inspectingItem.category)}
              </div>
              <div className="text-[12.5px] text-[#746C68]">
                Original Identifier:{' '}
                <span className="font-mono text-[#292525]">{inspectingItem.originalId || inspectingItem.recordId}</span>
              </div>
              <div className="text-[12.5px] text-[#746C68]">
                Archived By:{' '}
                <span className="font-medium text-[#292525]">
                  {inspectingItem.archivedByName || inspectingItem.archivedByAdminId}
                </span>{' '}
                on {formatDate(inspectingItem.archivedAt)}
              </div>
              <div className="text-[12.5px] text-[#746C68]">
                Reason:{' '}
                <span className="font-medium text-[#292525]">
                  {inspectingItem.reason || 'Concluded and archived.'}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold text-[#746C68] uppercase tracking-wider mb-1.5">
                Archived Snapshot Payload
              </div>
              <pre className="p-4 bg-[#292525] text-[#FAF7F2] rounded-xl text-[12px] font-mono overflow-x-auto max-h-[300px]">
                {JSON.stringify(inspectingItem.snapshot || inspectingItem, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E6DDD7]">
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const it = inspectingItem;
                  setInspectingItem(null);
                  setRestoringItem(it);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-[#557A61] hover:bg-[#43624D] rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore to Active</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* RESTORE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!restoringItem}
        onClose={() => setRestoringItem(null)}
        title="Restore Archived Record?"
        id="restore-archive-modal"
      >
        {restoringItem && (
          <div className="space-y-4">
            <p className="text-[14px] text-[#746C68] leading-relaxed">
              Restoring{' '}
              <strong className="text-[#292525]">{restoringItem.originalTitle || restoringItem.recordId}</strong> will
              reinstate this item back to the active platform dataset and operational moderation tables.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DDD7]">
              <button
                type="button"
                onClick={() => setRestoringItem(null)}
                className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525]"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-restore-archive-btn"
                onClick={handleRestore}
                className="px-4 py-2 text-[14px] font-semibold text-white bg-[#557A61] hover:bg-[#43624D] rounded-lg transition-colors cursor-pointer"
              >
                Restore Record
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
