import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation, useCommentsQuery } from '../../hooks/useTeamFlowQueries';
import type { Comment } from '../../types/teamflow';

const schema = z.object({ content: z.string().trim().min(1, 'Comment cannot be empty').max(2000, 'Comment is too long') });
type Values = z.infer<typeof schema>;

interface Props { taskId: string; currentUserId?: string; isAdmin?: boolean; }

const displayTime = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function CommentSection({ taskId, currentUserId, isAdmin = false }: Props) {
  const comments = useCommentsQuery(taskId);
  const create = useCreateCommentMutation(taskId);
  const update = useUpdateCommentMutation(taskId);
  const remove = useDeleteCommentMutation(taskId);
  const [editing, setEditing] = useState<Comment | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { content: '' } });

  const submit = form.handleSubmit(async (values) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, input: values });
      setEditing(null);
    } else {
      await create.mutateAsync(values);
    }
    form.reset({ content: '' });
  });

  if (comments.isLoading) return <div className="h-24 animate-pulse rounded-xl bg-slate-100" />;
  if (comments.isError) return <p className="text-sm text-red-600">Unable to load comments.</p>;

  return (
    <section className="space-y-4">
      <div className="space-y-3">
        {comments.data?.length ? comments.data.map((comment) => {
          const canManage = isAdmin || comment.authorId === currentUserId;
          return <article key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{comment.author?.name ?? 'Team member'}</p><p className="text-xs text-slate-500">{displayTime(comment.createdAt)}</p></div>{canManage && <div className="flex gap-1"><button aria-label="Edit comment" type="button" onClick={() => { setEditing(comment); form.reset({ content: comment.content }); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil size={15} /></button><button aria-label="Delete comment" type="button" onClick={() => { if (window.confirm('Delete this comment? This action cannot be undone.')) void remove.mutateAsync(comment.id); }} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></div>}</div><p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{comment.content}</p></article>;
        }) : <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No comments yet.</div>}
      </div>
      <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-900">{editing ? 'Edit comment' : 'Add a comment'}</h3>{editing && <button type="button" onClick={() => { setEditing(null); form.reset({ content: '' }); }} className="inline-flex items-center gap-1 text-xs text-slate-500"><X size={14} /> Cancel</button>}</div><textarea {...form.register('content')} rows={4} placeholder="Write a note for the team…" className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200" />{form.formState.errors.content && <p className="mt-1 text-xs text-red-600">{form.formState.errors.content.message}</p>}<div className="mt-3 flex justify-end"><button disabled={create.isPending || update.isPending} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><Send size={15} />{editing ? 'Save comment' : 'Post comment'}</button></div></form>
    </section>
  );
}

