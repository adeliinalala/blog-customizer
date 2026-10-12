import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import { useSidebarClose } from './hooks/useSidebarClose';

import type { ArticleStateType, OptionType } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (settings: ArticleStateType) => void;
  onReset: () => void;
};

export const ArticleParamsForm = ({
  onApply,
  onReset,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const [radioGroupKey, setRadioGroupKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useSidebarClose({
    containerRef,
    isSidebarOpen: isSidebarOpen,
    onClose: () => setIsSidebarOpen(false),
  });

  const handleChange = (
    field: keyof ArticleStateType
  ): ((option: OptionType) => void) => {
    return (option: OptionType): void => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: option,
      }));
    };
  };

  const handleReset = (): void => {
    setFormState(defaultArticleState);
    onReset();
    setRadioGroupKey((prevKey) => prevKey + 1);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  return (
    <div ref={containerRef}>
      <ArrowButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen)}
      />

      <aside
        className={clsx(styles.container, {
          [styles.container_open]: isSidebarOpen,
        })}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Text as="h2" size={22} weight={800} uppercase>
            Задайте параметры
          </Text>

          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={formState.fontFamilyOption}
            onChange={handleChange('fontFamilyOption')}
          />

          <RadioGroup
            key={'fontSize-' + radioGroupKey}
            title="Размер шрифта"
            name="fontSize"
            options={fontSizeOptions}
            selected={formState.fontSizeOption}
            onChange={handleChange('fontSizeOption')}
          />

          <Select
            title="Цвет шрифта"
            options={fontColors}
            selected={formState.fontColor}
            onChange={handleChange('fontColor')}
          />

          <Separator />

          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={formState.backgroundColor}
            onChange={handleChange('backgroundColor')}
          />

          <Select
            title="Ширина контента"
            options={contentWidthArr}
            selected={formState.contentWidth}
            onChange={handleChange('contentWidth')}
          />

          <div className={styles.bottomContainer}>
            <Button
              title="Сбросить"
              htmlType="button"
              type="clear"
              onClick={handleReset}
            />

            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
