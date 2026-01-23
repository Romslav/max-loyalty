# Validators - Form Validation

## Overview

Comprehensive form validation system with reusable rules and field validators.

## Validation Rules

### Pre-defined Rules

```typescript
import {
  emailRule,
  passwordRule,
  strongPasswordRule,
  phoneRule,
  requiredRule,
  urlRule,
  numericRule,
  integerRule,
  alphabeticRule,
  alphanumericRule,
} from '@/shared/validators';
```

### Dynamic Rules

```typescript
import {
  minLengthRule,
  maxLengthRule,
  minRule,
  maxRule,
  matchRule,
  matchFieldsRule,
  customRule,
} from '@/shared/validators';

// Min/Max length
const minLen = minLengthRule(8);
const maxLen = maxLengthRule(50);

// Min/Max value
const minVal = minRule(0);
const maxVal = maxRule(100);

// Regex match
const ipRule = matchRule(
  /^(\d{1,3}\.){3}\d{1,3}$/,
  'Invalid IP address'
);

// Field match (passwords, etc)
const passwordMatch = matchFieldsRule('password123');

// Custom validator
const customValidator = customRule(
  (value) => value.startsWith('USER_'),
  'Must start with USER_'
);
```

## Field Validator

### Single Field

```typescript
import { FieldValidator, requiredRule, emailRule } from '@/shared/validators';

const result = FieldValidator.validate('user@example.com', [
  requiredRule,
  emailRule,
]);

if (result.valid) {
  console.log('Email is valid!');
} else {
  console.log(result.errors); // Array of FieldError
}
```

### Multiple Fields

```typescript
import { FieldValidator, requiredRule, emailRule, passwordRule } from '@/shared/validators';

const schema = {
  email: [requiredRule, emailRule],
  password: [requiredRule, passwordRule],
  phone: [requiredRule, phoneRule],
};

const result = FieldValidator.validateFields({
  email: 'user@example.com',
  password: 'Password123',
  phone: '+79991234567',
}, schema);

if (result.valid) {
  console.log('Form is valid!');
} else {
  result.errors.forEach(err => {
    console.log(`${err.field}: ${err.message}`);
  });
}
```

### Utility Methods

```typescript
const errors = FieldValidator.validateFields(data, schema).errors;

// Get errors for specific field
const emailErrors = FieldValidator.getFieldErrors(errors, 'email');
// ['Invalid email format']

// Check if field has errors
const hasError = FieldValidator.hasFieldError(errors, 'email'); // boolean
```

## useForm Composable

### Basic Usage

```typescript
import { useForm } from '@/presentation';
import { requiredRule, emailRule, passwordRule } from '@/shared/validators';

const form = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: {
    email: [requiredRule, emailRule],
    password: [requiredRule, passwordRule],
  },
  async onSubmit(values) {
    console.log('Submitting:', values);
    await api.login(values);
  },
});
```

### Template Integration

```vue
<template>
  <form @submit.prevent="form.handleSubmit">
    <!-- Email field -->
    <input
      type="email"
      v-model="form.values.email"
      @blur="form.handleBlur('email')"
      @input="(e) => form.handleChange('email', e.target.value)"
      :class="form.getFieldStatus('email')"
    />
    <span v-if="form.touched.email && form.getFieldErrors('email')[0]">
      {{ form.getFieldErrors('email')[0] }}
    </span>

    <!-- Password field -->
    <input
      type="password"
      v-model="form.values.password"
      @blur="form.handleBlur('password')"
      @input="(e) => form.handleChange('password', e.target.value)"
      :class="form.getFieldStatus('password')"
    />
    <span v-if="form.touched.password && form.getFieldErrors('password')[0]">
      {{ form.getFieldErrors('password')[0] }}
    </span>

    <!-- Submit -->
    <button type="submit" :disabled="form.isSubmitting || !form.isValid">
      {{ form.isSubmitting ? 'Loading...' : 'Submit' }}
    </button>
  </form>
</template>

<script setup>
import { useForm } from '@/presentation';
import { requiredRule, emailRule, passwordRule } from '@/shared/validators';

const form = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: {
    email: [requiredRule, emailRule],
    password: [requiredRule, passwordRule],
  },
});
</script>
```

### Form State

```typescript
// Values
form.values.email      // Current value
form.setFieldValue('email', 'new@example.com')
form.setValues({ email: 'new@example.com', password: '...' })

// Errors
form.errors            // Array of all errors
form.setErrors([...])
form.setFieldError('email', 'Already in use')
form.clearFieldErrors('email')
form.clearErrors()

// Touched
form.touched.email     // Has field been touched?
form.setTouched('email')
form.setAllTouched()

// Dirty
form.isDirty           // Has form been modified?

// Submission
form.isSubmitting      // Currently submitting?
form.submitCount       // Number of submit attempts

// Validation
form.isValid           // Is form valid?
form.hasErrors         // Has any errors?
form.isFormTouched     // Has any field been touched?
```

### Methods

```typescript
// Validation
form.validate()             // Validate entire form
form.validateField('email') // Validate single field

// Handling
form.handleSubmit()                           // Validate & submit
form.handleBlur('email')                      // Mark touched & validate
form.handleChange('email', 'new@example.com') // Update & validate if touched

// Getting data
form.getFieldErrors('email')   // String[] of errors
form.getFieldStatus('email')   // { error, success, pristine }

// Reset
form.reset()  // Reset to initial values
```

## useInput Composable

### Basic Usage

```typescript
import { useInput } from '@/presentation';

const email = useInput({
  initialValue: '',
  debounce: 300,
  transform: (value) => value.trim(),
});
```

### Template Integration

```vue
<template>
  <input
    v-model="email.value"
    type="email"
    @focus="email.handleFocus"
    @blur="email.handleBlur"
    @input="(e) => email.handleInput(e.target.value, onEmailChange)"
    placeholder="Enter email"
  />
  <p v-if="email.isEmpty">Email is empty</p>
  <p v-if="email.isDirty">You made changes</p>
</template>

<script setup>
import { useInput } from '@/presentation';

const email = useInput({
  initialValue: 'default@example.com',
  debounce: 500,
});

const onEmailChange = (value) => {
  console.log('Email changed:', value);
};
</script>
```

### State & Methods

```typescript
// State
email.value       // Current value
email.isFocused   // Currently focused?
email.isDirty     // Has been modified?

// Computed
email.isEmpty     // Is empty?
email.isTrimmed   // Already trimmed?
email.formatted   // Formatted value (if format provided)
email.length      // Length of value

// Methods
email.setValue('new@example.com')
email.trim()                    // Remove whitespace
email.removeWhitespace()        // Remove all spaces
email.toLower()                 // Convert to lowercase
email.toUpper()                 // Convert to uppercase
email.capitalize()              // Capitalize first letter
email.handleFocus()
email.handleBlur()
email.handleInput(newValue, callback)
email.backspace(1)              // Remove n chars
email.append(' text')           // Add text at end
email.clear()                   // Clear value
email.reset()                   // Reset to initial
```

## Common Patterns

### Login Form

```typescript
const loginForm = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: {
    email: [requiredRule, emailRule],
    password: [requiredRule, minLengthRule(6)],
  },
  async onSubmit(values) {
    const { success } = await authService.login(values);
    if (success) {
      router.push('/dashboard');
    }
  },
});
```

### Registration Form

```typescript
const registerForm = useForm({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    fullName: '',
  },
  validationSchema: {
    email: [requiredRule, emailRule],
    password: [requiredRule, strongPasswordRule],
    confirmPassword: [requiredRule, matchFieldsRule(password)],
    phone: [requiredRule, phoneRule],
    fullName: [requiredRule, minLengthRule(2)],
  },
});
```

### Edit Profile

```typescript
const profileForm = useForm({
  initialValues: {
    fullName: '',
    phone: '',
    avatar: null,
  },
  validationSchema: {
    fullName: [requiredRule, alphabeticRule],
    phone: [phoneRule],
  },
  async onSubmit(values) {
    await userService.updateProfile(values);
  },
});
```

## Validation Messages

All messages are in Russian by default. To customize:

```typescript
const customRequired = {
  ...requiredRule,
  message: 'This field is required',
};

const customEmail = {
  ...emailRule,
  message: 'Please enter a valid email',
};
```
