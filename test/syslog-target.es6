import {Logger} from '../src/logging';
import SyslogTarget from '../src/syslog-target';

const logger = new Logger();
logger.targets.add(new SyslogTarget({host: 'docker', applicationName: 'MY-APP-NAME'}));

logger.info(() => ({hello: 'Nick Delitski'}), ({message}) => `Hello ${message.hello}`);