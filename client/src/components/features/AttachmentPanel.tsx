import { useState } from 'react';
import { Download, Paperclip, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attachmentUrl, deleteAttachment, fetchAttachments, uploadAttachment } from '../../api/features.api';
import toast from 'react-hot-toast';

export default function AttachmentPanel({ taskId }: { taskId: string }) {
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['attachments', taskId], queryFn: () => fetchAttachments(taskId) });
  const remove = useMutation({ mutationFn: deleteAttachment, onSuccess: () => qc.invalidateQueries({ queryKey: ['attachments', taskId] }) });
  const add = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try { await uploadAttachment(taskId, file); await qc.invalidateQueries({ queryKey: ['attachments', taskId] }); toast.success('Attachment uploaded'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Upload failed'); }
    finally { setBusy(false); }
  };
  return <section className="rounded-2xl card p-4">
    <div className="flex items-center justify-between"><h3 className="font-semibold flex gap-2"><Paperclip size={18}/> Files</h3><label className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">{busy ? 'Uploading…' : 'Attach file'}<input type="file" hidden disabled={busy} onChange={e => { void add(e.target.files?.[0]); e.currentTarget.value = ''; }}/></label></div>
    <div className="mt-3 space-y-2">{data.length ? data.map((a: any) => <div key={a.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><div><div className="text-sm font-medium">{a.fileName}</div><div className="text-xs text-slate-500">{Math.ceil(a.size / 1024)} KB</div></div><div className="flex gap-2"><a className="rounded p-2 hover:bg-white dark:hover:bg-slate-700" href={attachmentUrl(a.id)} target="_blank" rel="noreferrer"><Download size={16}/></a><button className="rounded p-2 text-red-500 hover:bg-red-50" onClick={() => remove.mutate(a.id)}><Trash2 size={16}/></button></div></div>) : <p className="text-sm text-slate-500">No files attached. Maximum 5 MB per file.</p>}</div>
  </section>;
}
