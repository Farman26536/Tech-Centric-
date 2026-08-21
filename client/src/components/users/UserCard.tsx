import { Mail, Shield, UserRound } from 'lucide-react';
import type { User } from '../../types/user.types';

interface Props {
  user: User;
  isCurrentUser?: boolean;
  onSelect?: () => void;
  onRoleChange?: (role: 'ADMIN' | 'MEMBER') => void;
}

const roleStyles: Record<User['role'], string> = {
  ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
  MEMBER: 'bg-blue-100 text-blue-700 border-blue-200'
};

export default function UserCard({ user, isCurrentUser, onSelect, onRoleChange }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <UserRound size={20} className="text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{user.name}</h3>
                {isCurrentUser && <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">You</span>}
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <Mail size={14} />
                {user.email}
              </div>
            </div>
          </div>
          <span className={`shrink-0 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}>
            <Shield size={12} />
            {user.role}
          </span>
        </div>
      </button>

      {onRoleChange && !isCurrentUser && (
        <div className="mt-4 flex gap-2">
          {user.role === 'MEMBER' ? (
            <button
              type="button"
              onClick={() => onRoleChange('ADMIN')}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Make Admin
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onRoleChange('MEMBER')}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Make Member
            </button>
          )}
        </div>
      )}
    </article>
  );
}
