import { useEffect, useRef, useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);

    return (): void => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isOpen]);

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
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  return (
    <div ref={containerRef}>
      <ArrowButton
        isOpen={isOpen}
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      />

      <aside className={`${styles.container} ${isOpen ? styles.container_open : ''}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={formState.fontFamilyOption}
            onChange={handleChange('fontFamilyOption')}
          />

          <RadioGroup
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

          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={formState.backgroundColor}
            onChange={handleChange('backgroundColor')}
          />

          <RadioGroup
            title="Ширина контента"
            name="contentWidth"
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
