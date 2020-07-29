import * as React from 'react';
import { take } from 'lodash';
import { Avatar, Props as AvatarProps } from '../Avatar';
import { ContactName } from './ContactName';
import { Emojify } from './Emojify';
import { Intl } from '../Intl';
import { LocalizerType } from '../../types/Util';

export type Props = {
  i18n: LocalizerType;
  isMe?: boolean;
  groups?: Array<string>;
  membersCount?: number;
  phoneNumber?: string;
  onHeightChange?: () => unknown;
} & Omit<AvatarProps, 'onClick' | 'size' | 'noteToSelf'>;

const renderMembershipRow = ({
  i18n,
  groups,
  conversationType,
  isMe,
}: Pick<Props, 'i18n' | 'groups' | 'conversationType' | 'isMe'>) => {
  const className = 'module-conversation-hero__membership';
  const nameClassName = `${className}__name`;

  if (isMe) {
    return <div className={className}>{i18n('noteToSelfHero')}</div>;
  }

  if (conversationType === 'direct' && groups && groups.length > 0) {
    const firstThreeGroups = take(groups, 3).map((group, i) => (
      <strong key={i} className={nameClassName}>
        <Emojify text={group} />
      </strong>
    ));

    if (firstThreeGroups.length >= 3) {
      return (
        <div className={className}>
          <Intl
            i18n={i18n}
            id="ConversationHero--membership-3"
            components={{
              group1: firstThreeGroups[0],
              group2: firstThreeGroups[1],
              group3: firstThreeGroups[2],
            }}
          />
        </div>
      );
    } else if (firstThreeGroups.length >= 2) {
      return (
        <div className={className}>
          <Intl
            i18n={i18n}
            id="ConversationHero--membership-2"
            components={{
              group1: firstThreeGroups[0],
              group2: firstThreeGroups[1],
            }}
          />
        </div>
      );
    } else if (firstThreeGroups.length >= 1) {
      return (
        <div className={className}>
          <Intl
            i18n={i18n}
            id="ConversationHero--membership-1"
            components={{
              group: firstThreeGroups[0],
            }}
          />
        </div>
      );
    }
  }

  return null;
};

export const ConversationHero = ({
  i18n,
  avatarPath,
  color,
  conversationType,
  isMe,
  membersCount,
  groups = [],
  name,
  phoneNumber,
  profileName,
  title,
  onHeightChange,
}: Props) => {
  const firstRenderRef = React.useRef(true);

  React.useEffect(() => {
    // If any of the depenencies for this hook change then the height of this
    // component may have changed. The cleanup function notifies listeners of
    // any potential height changes.
    return () => {
      if (onHeightChange && !firstRenderRef.current) {
        onHeightChange();
      } else {
        firstRenderRef.current = false;
      }
    };
  }, [
    firstRenderRef,
    onHeightChange,
    // Avoid collisions in these dependencies by prefixing them
    // These dependencies may be dynamic, and therefore may cause height changes
    `mc-${membersCount}`,
    `n-${name}`,
    `pn-${profileName}`,
    ...groups.map(g => `g-${g}`),
  ]);

  const phoneNumberOnly = Boolean(
    !name && !profileName && conversationType === 'direct'
  );

  return (
    <div className="module-conversation-hero">
      <Avatar
        i18n={i18n}
        color={color}
        noteToSelf={isMe}
        avatarPath={avatarPath}
        conversationType={conversationType}
        name={name}
        profileName={profileName}
        title={title}
        size={112}
        className="module-conversation-hero__avatar"
      />
      <h1 className="module-conversation-hero__profile-name">
        {isMe ? (
          i18n('noteToSelf')
        ) : (
          <ContactName
            title={title}
            name={name}
            profileName={profileName}
            phoneNumber={phoneNumber}
            i18n={i18n}
          />
        )}
      </h1>
      {!isMe ? (
        <div className="module-conversation-hero__with">
          {membersCount === 1
            ? i18n('ConversationHero--members-1')
            : membersCount !== undefined
            ? i18n('ConversationHero--members', [`${membersCount}`])
            : phoneNumberOnly
            ? null
            : phoneNumber}
        </div>
      ) : null}
      {renderMembershipRow({ isMe, groups, conversationType, i18n })}
    </div>
  );
};