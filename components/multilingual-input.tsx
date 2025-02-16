'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation, TranslatedText } from '@/contexts/translation-context';
import { Label } from '@/components/ui/label';

export interface MultilingualInputProps {
  onSubmit?: (text: string) => void;
  placeholder?: string;
  label?: string;
}

export const MultilingualInput: React.FC<MultilingualInputProps> = ({
  onSubmit,
  placeholder = 'Write something...',
  label = 'Write in any language'
}) => {
  const [text, setText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const { currentLanguage, translate } = useTranslation();

  const handleSubmit = () => {
    if (onSubmit && text.trim()) {
      onSubmit(text);
      setText('');
      setShowTranslation(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label>{label}</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px]"
          />
        </div>
        
        {text.trim() && showTranslation && currentLanguage !== 'en' && (
          <div className="space-y-2">
            <Label>Translation Preview</Label>
            <div className="p-3 bg-secondary rounded-md">
              <TranslatedText text={text} />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {text.trim() && (
            <Button
              variant="outline"
              onClick={() => setShowTranslation(!showTranslation)}
            >
              {showTranslation ? 'Hide' : 'Show'} Translation
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={!text.trim()}>
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const MultilingualText: React.FC<{
  text: string;
  showOriginal?: boolean;
}> = ({ text, showOriginal = false }) => {
  const { currentLanguage } = useTranslation();
  const [showBoth, setShowBoth] = useState(showOriginal);

  return (
    <div className="space-y-2">
      {(showBoth || currentLanguage === 'en') && (
        <div className="text-foreground">{text}</div>
      )}
      {(showBoth || currentLanguage !== 'en') && currentLanguage !== 'en' && (
        <div className="text-muted-foreground">
          <TranslatedText text={text} />
        </div>
      )}
      {currentLanguage !== 'en' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBoth(!showBoth)}
          className="text-xs"
        >
          {showBoth ? 'Show Only Translation' : 'Show Original'}
        </Button>
      )}
    </div>
  );
};

export default MultilingualInput;
