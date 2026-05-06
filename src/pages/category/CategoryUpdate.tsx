import React, { useState } from 'react';
import { Switch,  Button, Divider, Grid, Group, Paper, Stack, Textarea, TextInput, Modal  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import useCategoryUpdateViewModel from 'pages/category/CategoryUpdate.vm';

function CategoryUpdate() {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [rawText, setRawText] = useState('');

  const {
    category,
    form,
    handleFormSubmit,
    categorySelectList,
    statusSelectList,
    smartImport,
    isAutoFilling,
  } = useCategoryUpdateViewModel(Number(id));

  if (!category) {
    return null;
  }

  return (
    <Stack sx={{ maxWidth: 800 }}>
      <CreateUpdateTitle
        managerPath={CategoryConfigs.managerPath}
        title={CategoryConfigs.updateTitle}
      />

      <DefaultPropertyPanel
        id={category.id}
        createdAt={category.createdAt}
        updatedAt={category.updatedAt}
        createdBy="1"
        updatedBy="1"
      />

      <Modal opened={opened} onClose={close} title="✨ Nhập danh mục thông minh" size="lg">
        <Stack>
          <Textarea 
            placeholder="Dán thông tin danh mục vào đây..." 
            minRows={6}
            value={rawText}
            onChange={(e) => setRawText(e.currentTarget.value)}
          />
          <Group position="right">
            <Button variant="default" onClick={close}>Hủy</Button>
            <Button 
                loading={isAutoFilling} 
                onClick={async () => {
                    await smartImport(rawText);
                    close();
                    setRawText('');
                }}
            >
                Cập nhật form
            </Button>
          </Group>
        </Stack>
      </Modal>

      <div className="flex justify-end mb-2">
        <Button 
            variant="light" 
            size="xs" 
            leftIcon={<span>✨</span>}
            onClick={open}
        >
            Nhập nhanh
        </Button>
      </div>

      <form onSubmit={handleFormSubmit}>
        <input type="hidden" {...form.getInputProps('level')} value={category.level || 1} />
        <Paper shadow="xs">
          <Stack spacing={0}>
            <Grid p="sm">
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={CategoryConfigs.properties.name.label}
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={CategoryConfigs.properties.slug.label}
                  {...form.getInputProps('slug')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Switch
                  size="md"
                  label={CategoryConfigs.properties.status.label}
                  checked={form.values.status === '1'}
                  onChange={(event) => form.setFieldValue('status', event.currentTarget.checked ? '1' : '0')}
                />
              </Grid.Col>
            </Grid>

            <Divider mt="xs"/>

            <Group position="apart" p="sm">
              <Button variant="default" onClick={form.reset}>Mặc định</Button>
              <Button type="submit">Cập nhật</Button>
            </Group>
          </Stack>
        </Paper>
      </form>
    </Stack>
  );
}

export default CategoryUpdate;
