import React, { useEffect, useState } from 'react';
import { User } from '../types/User';
import { client } from '../utils/fetchClient';
import classNames from 'classnames';
import { Post } from '../types/Post';

type Props = {
  addPosts: (userId: number) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUser: User | null;
  setSelectedUser: (selectedUser: User | null) => void;
  setSelectedPost: (selectedPost: Post | null) => void;
};

export const UserSelector: React.FC<Props> = ({
  addPosts,
  users,
  setUsers,
  selectedUser,
  setSelectedUser,
  setSelectedPost,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    client.get<User[]>(`/users`).then(setUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserSelect = (user: User) => {
    addPosts(user.id);
    setSelectedUser(user);
    setIsDropdownOpen(false);
    setSelectedPost(null);
  };

  return (
    <div
      data-cy="UserSelector"
      className={classNames('dropdown', { 'is-active': isDropdownOpen })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setIsDropdownOpen(prev => !prev)}
          onBlur={() => setIsDropdownOpen(false)}
        >
          <span>{selectedUser ? selectedUser.name : 'Choose a user'}</span>

          <span className="icon is-small">
            <i
              className={`fas fa-angle-${isDropdownOpen ? 'up' : 'down'}`}
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map(user => {
            return (
              <a
                href={`#user-${user.id}`}
                className={classNames('dropdown-item', {
                  'is-active': selectedUser?.id === user.id,
                })}
                key={user.id}
                onMouseDown={() => handleUserSelect(user)}
              >
                {user.name}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
