import { Container, Text, Button, Group } from '@mantine/core';
// import { GithubIcon } from '@mantinex/dev-icons';
import classes from './page.module.css';
import { Icon3dRotate } from '@tabler/icons-react';

export default function Home() {
  return (
    <div className={classes.wrapper}>
      <Container size={'xl'} className={classes.inner}>
        <h1 className={classes.title}>
         
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            WorkForce Watch
          </Text>{' '}
        </h1>

        

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Get started
          </Button>

          <Button
            component="a"
            href="https://github.com/mantinedev/mantine"
            size="xl"
            variant="default"
            className={classes.control}
            leftSection={<Icon3dRotate size={20} />}
          >
            GitHub
          </Button>
        </Group>
      </Container>
    </div>
  );
}