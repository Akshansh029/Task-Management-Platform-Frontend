'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label as FormLabel } from '@/components/ui/label';
import LabelBadge from './LabelBadge';

const LabelForm = ({ open, onOpenChange, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'), // Random color
      });
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.color)) {
      newErrors.color = 'Invalid hex color';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Label</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel htmlFor="label-name">Label Name</FormLabel>
            <Input
              id="label-name"
              placeholder="e.g. Bug, Feature, Internal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <FormLabel htmlFor="label-color">Label Color</FormLabel>
            <div className="flex space-x-2">
              <Input
                id="label-color"
                type="color"
                className="w-12 p-1 h-10 cursor-pointer"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <Input
                placeholder="#000000"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className={errors.color ? 'border-red-500 flex-1' : 'flex-1'}
              />
            </div>
            {errors.color && <p className="text-xs text-red-500">{errors.color}</p>}
          </div>

          <div className="pt-2">
            <FormLabel className="mb-2 block">Preview</FormLabel>
            <div className="p-4 border rounded-md bg-gray-50 flex justify-center">
              <LabelBadge label={formData} />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Label'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LabelForm;
