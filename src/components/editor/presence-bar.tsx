'use client';

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { PresenceUser } from '@/lib/hooks/use-presence';

const MAX_VISIBLE = 4;

function initials(email: string) {
  return (email.split('@')[0] || '?').slice(0, 2).toUpperCase();
}

export function PresenceBar({ users }: { users: PresenceUser[] }) {
  if (users.length === 0) return null;

  const visible = users.slice(0, MAX_VISIBLE);
  const overflow = users.length - visible.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Who's viewing this document">
          <AvatarGroup>
            {visible.map((u) => (
              <Avatar key={u.userId} size="sm">
                <AvatarFallback style={{ backgroundColor: u.color, color: 'white' }}>
                  {initials(u.email)}
                </AvatarFallback>
              </Avatar>
            ))}
            {overflow > 0 && <AvatarGroupCount>+{overflow}</AvatarGroupCount>}
          </AvatarGroup>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <p className="text-muted-foreground px-2 pb-1 text-xs font-medium">
          Viewing this document
        </p>
        <ul className="flex flex-col gap-1">
          {users.map((u) => (
            <li key={u.userId} className="flex items-center gap-2 rounded-md px-2 py-1 text-sm">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: u.color }}
              />
              <span className="truncate">{u.email}</span>
              {u.isSelf && <span className="text-muted-foreground text-xs">(you)</span>}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
