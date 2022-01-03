// Libraries
import React from 'react';
import {
  Button,
  Text,
  useToast,
  Textarea,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useBoolean,
} from '@chakra-ui/react';
import safeJsonStringify from 'safe-json-stringify';
import { doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { validateReportEntity, MAX_REPORT_REASON_LENGTH } from '@campus-gaming-network/tools';

// Utilities
import { sanitizePrivateProperties } from 'src/utilities/other';

// Constants
import { CALLABLES } from 'src/constants/firebase';

// Other
import { db, functions } from 'src/firebase';

////////////////////////////////////////////////////////////////////////////
// ReportEntityDialog

const ReportEntityDialog = (props) => {
  const toast = useToast();
  const cancelRef = React.useRef();
  const [reason, setReason] = React.useState('');
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const [errors, setErrors] = React.useState({});
  const reasonCharactersRemaining = React.useMemo(
    () => (Boolean(reason) ? MAX_REPORT_REASON_LENGTH - reason.length : MAX_REPORT_REASON_LENGTH),
    [reason],
  );

  const handleSubmit = async () => {
    const { error } = validateReportEntity({ reason });

    if (error) {
      const errors = error.details.reduce((acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }), {});
      setErrors(errors);
      return;
    }

    setIsSubmitting.on();

    const reportData = {
      entity: {
        ...props.entity,
      },
      reason,
      metadata: safeJsonStringify({
        href: window.location.href,
        pageProps: sanitizePrivateProperties({ ...props.pageProps }),
        timestamp: Date.now(),
      }),
    };

    try {
      const reportEntity = httpsCallable(functions, CALLABLES.REPORT_ENTITY);
      await reportEntity(reportData);
      props.onClose();
      setIsSubmitting.off();
      toast({
        title: 'Reported succesfully.',
        description: 'Your report has been recorded and will be manually reviewed. Thank you.',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      props.onClose();
      setIsSubmitting.off();
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleOnClose = () => {
    setReason('');
    setIsSubmitting.off();
    setErrors({});
    props.onClose();
  };

  return (
    <AlertDialog isOpen={props.isOpen} leastDestructiveRef={cancelRef} onClose={handleOnClose}>
      <AlertDialogOverlay />
      <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
        <AlertDialogHeader>
          Report{' '}
          {props.entity.type === 'users'
            ? props.pageProps.user.fullName
            : props.entity.type === 'schools'
            ? props.pageProps.school.formattedName
            : props.entity.type === 'events'
            ? props.pageProps.event.name
            : 'Entity'}
        </AlertDialogHeader>

        <AlertDialogBody>
          <FormControl isRequired isInvalid={errors.reason}>
            <FormLabel htmlFor="reason" fontWeight="bold">
              Report reason
            </FormLabel>
            <Textarea
              id="reason"
              name="reason"
              onChange={(e) => setReason(e.target.value)}
              value={reason}
              placeholder="Tell us why you are reporting."
              size="lg"
              resize="vertical"
              maxLength="5000"
              h="150px"
            />
            <FormHelperText id="description-helper-text">
              Explain your reason for reporting in fewer than {MAX_REPORT_REASON_LENGTH.toLocaleString()} characters.{' '}
              <Text as="span" color={reasonCharactersRemaining <= 0 ? 'red.500' : undefined}>
                {reasonCharactersRemaining.toLocaleString()} characters remaining.
              </Text>
            </FormHelperText>
            <FormErrorMessage>{errors.reason}</FormErrorMessage>
          </FormControl>
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="brand" disabled={true}>
              Submitting...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={cancelRef} onClick={handleOnClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSubmit} ml={3}>
                Submit report
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportEntityDialog;
