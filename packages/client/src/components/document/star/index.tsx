import { IconStar } from '@douyinfe/semi-icons';
import { Button, Tooltip } from '@douyinfe/semi-ui';
import { IDocument, IWiki } from '@think/domains';
import { useDocumentStarToggle } from 'data/star';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

interface IProps {
  wikiId: IWiki['id'];
  documentId: IDocument['id'];
  disabled?: boolean;
  render?: (arg: {
    star: boolean;
    disabled: boolean;
    text: string;
    toggleStar: () => Promise<void>;
  }) => React.ReactNode;
}

export const DocumentStar: React.FC<IProps> = ({ wikiId, documentId, disabled = false, render }) => {
  const [visible, toggleVisible] = useToggle(false);
  const { data, toggle: toggleStar } = useDocumentStarToggle(wikiId, documentId, { enabled: visible });
  const text = data ? '取消收藏' : '收藏文档';

  const onViewportChange = useCallback(
    (visible) => {
      if (visible) {
        toggleVisible(true);
      }
    },
    [toggleVisible]
  );

  return (
    <VisibilitySensor onChange={onViewportChange}>
      {render ? (
        render({ star: data, disabled, toggleStar, text })
      ) : (
        <Tooltip content={text} position="bottom">
          <Button
            icon={<IconStar />}
            theme="borderless"
            style={{
              color: data ? 'rgba(var(--semi-amber-4), 1)' : 'rgba(var(--semi-grey-3), 1)',
            }}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleStar();
            }}
          />
        </Tooltip>
      )}
    </VisibilitySensor>
  );
};
