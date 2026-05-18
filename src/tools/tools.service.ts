import { Injectable, Logger } from '@nestjs/common';
import { Context, Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { ChildProcess, exec } from 'child_process';

@Injectable()
export class ToolService {
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger(`${ToolService.name}`);
  }

  @Tool({
    name: 'shell-command',
    description: 'Executes a shell command.',
    annotations: {
      destructiveHint: true,
    },
    parameters: z
      .object({
        command: z.string().describe('The shell command to execute.'),
        timeout: z
          .number()
          .optional()
          .describe(
            'The maximum time in milliseconds to allow the command to run. Defaults to 60000 (60 seconds).',
          ),
      })
      .required(),
    outputSchema: z.object({
      stdout: z
        .string()
        .optional()
        .describe('The standard output from the command.'),
      stderr: z
        .string()
        .optional()
        .describe('The standard error output from the command.'),
      error: z
        .string()
        .optional()
        .describe('Any error that occurred during command execution.'),
    }),
  })
  async shellCommandTool(
    params: { command: string; timeout?: number },
    _context: Context,
  ): Promise<{ stdout: string; stderr: string; error?: string }> {
    this.logger.log(
      `shellCommandTool called with params: ${JSON.stringify(params)}`,
    );

    return new Promise((resolve) => {
      let child: ChildProcess | null = null;
      try {
        child = exec(params.command, {
          cwd: '/home/node',
          env: {
            ...process.env,
            C8Y_SETTINGS_CI: 'true',
            C8Y_SETTINGS_DEFAULTS_FORCE: 'true',
            C8Y_SETTINGS_DEFAULTS_NULLINPUT: 'true',
          },
          timeout: params.timeout || 60_000,
        });
      } catch (error) {
        this.logger.error(`Failed to start command: ${error}`);
        resolve({ stdout: '', stderr: '', error: `${error}` });
        return;
      }
      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data: string) => {
        stdout += data;
        this.logger.log(`stdout: ${data}`);
      });

      child.stderr?.on('data', (data: string) => {
        stderr += data;
        this.logger.warn(`stderr: ${data}`);
      });

      child.on('close', (code) => {
        this.logger.log(
          `Command finished with exit code: ${code}, stderr: ${stderr}`,
        );
        resolve({
          stdout,
          stderr,
          error: code !== 0 ? `Process exited with code ${code}` : '',
        });
      });

      child.on('error', (error) => {
        this.logger.error(`Command error: ${error}`);
        resolve({ stdout, stderr, error: `${error}` });
      });
    });
  }
}
